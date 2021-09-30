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
import { Material } from '../../assets';
import { PipelineSceneData } from '../pipeline-scene-data';
import { macro } from '../../platform/macro';

export const BLOOM_PREFILTERPASS_INDEX = 0;
export const BLOOM_DOWNSAMPLEPASS_INDEX = 1;
export const BLOOM_UPSAMPLEPASS_INDEX = 2;
export const BLOOM_COMBINEPASS_INDEX = 3;

export class CommonPipelineSceneData extends PipelineSceneData {
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

    public initPipelinePassInfo () {
        const bloomMat = new Material();
        bloomMat._uuid = 'builtin-bloom-material';
        bloomMat.initialize({ effectName: 'bloom' });
        for (let i = 0; i < bloomMat.passes.length; ++i) {
            bloomMat.passes[i].tryCompile();
        }
        this._bloomMaterial = bloomMat;

        const postMat = new Material();
        postMat._uuid = 'builtin-post-process-material';
        postMat.initialize({
            effectName: 'post-process',
            defines: {
                // Anti-aliasing type, currently only fxaa, so 1 means fxaa
                ANTIALIAS_TYPE: macro.ENABLE_ANTIALIAS_FXAA ? 1 : 0,
            },
        });
        for (let i = 0; i < postMat.passes.length; ++i) {
            postMat.passes[i].tryCompile();
        }
        this._postprocessMaterial = postMat;

        this.updatePipelinePassInfo();
    }

    public activate (device: Device, pipeline: RenderPipeline) {
        super.activate(device, pipeline);
        this.initPipelinePassInfo();
        return true;
    }

    protected updatePipelinePassInfo () {
        this.updateBloomPass();
        this.updatePostProcessPass();
    }

    private updateBloomPass () {
        if (!this._bloomMaterial) return;

        const passPrefilter = this._bloomMaterial.passes[BLOOM_PREFILTERPASS_INDEX];
        passPrefilter.beginChangeStatesSilently();
        passPrefilter.tryCompile();
        passPrefilter.endChangeStatesSilently();

        const passDownsample = this._bloomMaterial.passes[BLOOM_DOWNSAMPLEPASS_INDEX];
        passDownsample.beginChangeStatesSilently();
        passDownsample.tryCompile();
        passDownsample.endChangeStatesSilently();

        const passUpsample = this._bloomMaterial.passes[BLOOM_UPSAMPLEPASS_INDEX];
        passUpsample.beginChangeStatesSilently();
        passUpsample.tryCompile();
        passUpsample.endChangeStatesSilently();

        const passCombine = this._bloomMaterial.passes[BLOOM_COMBINEPASS_INDEX];
        passCombine.beginChangeStatesSilently();
        passCombine.tryCompile();
        passCombine.endChangeStatesSilently();

        if (JSB) {
            this._nativeObj!.bloomPrefilterPassShader = passPrefilter.getShaderVariant();
            this._nativeObj!.bloomPrefilterPass = passPrefilter.native;
            this._nativeObj!.bloomDownsamplePassShader = passDownsample.getShaderVariant();
            this._nativeObj!.bloomDownsamplePass = passDownsample.native;
            this._nativeObj!.bloomUpsamplePassShader = passUpsample.getShaderVariant();
            this._nativeObj!.bloomUpsamplePass = passUpsample.native;
            this._nativeObj!.bloomCombinePassShader = passCombine.getShaderVariant();
            this._nativeObj!.bloomCombinePass = passCombine.native;
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
}
