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

export class CommonPipelineSceneData extends PipelineSceneData {
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
        this.updatePostProcessPass();
    }

    private updatePostProcessPass () {
        if (!this.postprocessMaterial) return;

        const passPost = this.postprocessMaterial.passes[0];
        passPost.beginChangeStatesSilently();
        passPost.tryCompile();
        passPost.endChangeStatesSilently();

        if (JSB) {
            this._nativeObj!.deferredPostPassShader = passPost.getShaderVariant();
            this._nativeObj!.deferredPostPass = passPost.native;
        }
    }
}
